package com.ftn.sbnz.service.service;

import com.ftn.sbnz.model.model.RiskAlert;
import com.ftn.sbnz.model.model.WeatherMeasurement;

import org.kie.api.event.rule.DebugAgendaEventListener;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.conf.ClockTypeOption;
import org.kie.api.runtime.rule.EntryPoint;
import org.kie.api.time.SessionPseudoClock;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

import javax.annotation.PreDestroy;

@Service
public class CepService {

    private final KieContainer kieContainer;

    private KieSession realtimeSession;
    private KieSession pseudoSession;
    private EntryPoint realtimeWeatherStream;
    private EntryPoint pseudoWeatherStream;

    private final ReentrantLock sessionLock = new ReentrantLock();

    public CepService(KieContainer kieContainer) {
        this.kieContainer = kieContainer;
        initRealtimeSession();
        initPseudoSession();
    }

    private void initRealtimeSession() {
        realtimeSession = kieContainer.newKieSession("malina-cep-ks");
        realtimeWeatherStream = realtimeSession.getEntryPoint("weather-stream");
        if (realtimeWeatherStream == null) {
            throw new IllegalStateException("Entry point 'weather-stream' nije pronađen u malina-cep-ks.");
        }
        realtimeSession.addEventListener(new DebugAgendaEventListener());
    }

    private void initPseudoSession() {
        pseudoSession = kieContainer.newKieSession("malina-cep-ks-pseudo");
        pseudoWeatherStream = pseudoSession.getEntryPoint("weather-stream");
        if (pseudoWeatherStream == null) {
            throw new IllegalStateException("Entry point 'weather-stream' nije pronađen u malina-cep-ks-pseudo.");
        }
        pseudoSession.addEventListener(new DebugAgendaEventListener());
        SessionPseudoClock clock = pseudoSession.getSessionClock();
        clock.advanceTime(System.currentTimeMillis(), TimeUnit.MILLISECONDS);
    }

    public List<RiskAlert> insertMeasurement(WeatherMeasurement measurement, boolean usePseudoClock) {
        sessionLock.lock();
        try {
            KieSession session = usePseudoClock ? pseudoSession : realtimeSession;
            EntryPoint stream = usePseudoClock ? pseudoWeatherStream : realtimeWeatherStream;

            if (usePseudoClock && measurement.getTimestamp() != null) {
                SessionPseudoClock clock = pseudoSession.getSessionClock();
                long target = measurement.getTimestamp().getTime();
                long current = clock.getCurrentTime();
                if (target > current) {
                    clock.advanceTime(target - current, TimeUnit.MILLISECONDS);
                }
            }

            stream.insert(measurement);
            session.getAgenda().getAgendaGroup("cep-rules").setFocus();
            session.fireAllRules();

            return collectAlerts(session);
        } finally {
            sessionLock.unlock();
        }
    }

    public List<RiskAlert> insertSprayEvent(Object sprayEvent, boolean usePseudoClock) {
        sessionLock.lock();
        try {
            KieSession session = usePseudoClock ? pseudoSession : realtimeSession;
            EntryPoint stream = usePseudoClock ? pseudoWeatherStream : realtimeWeatherStream;

            stream.insert(sprayEvent);
            session.getAgenda().getAgendaGroup("cep-rules").setFocus();
            session.fireAllRules();

            return collectAlerts(session);
        } finally {
            sessionLock.unlock();
        }
    }

    public List<RiskAlert> getActiveAlerts(boolean usePseudoClock) {
        sessionLock.lock();
        try {
            KieSession session = usePseudoClock ? pseudoSession : realtimeSession;
            return collectAlerts(session);
        } finally {
            sessionLock.unlock();
        }
    }

    public List<RiskAlert> getActiveAlertsForLocation(String location, boolean usePseudoClock) {
        sessionLock.lock();
        try {
            KieSession session = usePseudoClock ? pseudoSession : realtimeSession;
            List<RiskAlert> result = new ArrayList<>();
            session.getObjects(obj -> obj instanceof RiskAlert)
                    .forEach(obj -> {
                        RiskAlert alert = (RiskAlert) obj;
                        if (location.equalsIgnoreCase(alert.getLocation())) {
                            result.add(alert);
                        }
                    });
            return result;
        } finally {
            sessionLock.unlock();
        }
    }

    public List<RiskAlert> analyzeWeather(List<WeatherMeasurement> measurements) {
        KieSession kieSession = kieContainer.newKieSession("malina-cep-ks");
        List<RiskAlert> alerts = new ArrayList<>();

        try {
            EntryPoint weatherStream = kieSession.getEntryPoint("weather-stream");
            if (weatherStream == null) {
                throw new RuntimeException("Entry point 'weather-stream' nije pronađen u sesiji.");
            }

            for (WeatherMeasurement measurement : measurements) {
                weatherStream.insert(measurement);
            }

            kieSession.getAgenda().getAgendaGroup("cep-rules").setFocus();
            kieSession.fireAllRules();

            alerts.addAll(collectAlerts(kieSession));
        } finally {
            kieSession.dispose();
        }

        return alerts;
    }

    public void resetPseudoSession() {
        sessionLock.lock();
        try {
            if (pseudoSession != null) {
                pseudoSession.dispose();
            }
            initPseudoSession();
        } finally {
            sessionLock.unlock();
        }
    }

    private List<RiskAlert> collectAlerts(KieSession session) {
        List<RiskAlert> alerts = new ArrayList<>();
        session.getObjects(obj -> obj instanceof RiskAlert)
                .forEach(obj -> alerts.add((RiskAlert) obj));
        return alerts;
    }

    @PreDestroy
    public void shutdown() {
        sessionLock.lock();
        try {
            if (realtimeSession != null) realtimeSession.dispose();
            if (pseudoSession != null) pseudoSession.dispose();
        } finally {
            sessionLock.unlock();
        }
    }
}