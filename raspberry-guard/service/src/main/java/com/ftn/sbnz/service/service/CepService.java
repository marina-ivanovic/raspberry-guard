package com.ftn.sbnz.service.service;

import com.ftn.sbnz.model.model.RiskAlert;
import com.ftn.sbnz.model.model.WeatherMeasurement;

import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.rule.EntryPoint;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import org.kie.api.event.rule.DebugAgendaEventListener;

@Service
public class CepService {

    private final KieContainer kieContainer;

    public CepService(KieContainer kieContainer) {
        this.kieContainer = kieContainer;
    }

    public List<RiskAlert> analyzeWeather(List<WeatherMeasurement> measurements) {
        KieSession kieSession = kieContainer.newKieSession("malina-cep-ks");
        List<RiskAlert> alerts = new ArrayList<>();

        try {
            EntryPoint weatherStream = kieSession.getEntryPoint("weather-stream");

            if (weatherStream == null) {
                throw new RuntimeException("Entry point 'weather-stream' nije pronadjen u sesiji.");
            }

            for (WeatherMeasurement measurement : measurements) {
                weatherStream.insert(measurement);
            }

            kieSession.getAgenda().getAgendaGroup("cep-rules").setFocus();
            kieSession.addEventListener(new DebugAgendaEventListener());
            kieSession.fireAllRules();

            kieSession.getObjects(obj -> obj instanceof RiskAlert)
                    .forEach(obj -> alerts.add((RiskAlert) obj));

        } finally {
            kieSession.dispose();
        }

        return alerts;
    }
}
