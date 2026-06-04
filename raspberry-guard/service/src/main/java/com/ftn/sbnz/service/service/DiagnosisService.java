package com.ftn.sbnz.service.service;

import com.ftn.sbnz.model.model.*;
import com.ftn.sbnz.service.dto.DiagnosisRequest;

import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.kie.api.runtime.rule.EntryPoint; // DODATO OVO
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

import org.kie.api.event.rule.DebugAgendaEventListener;

@Service
public class DiagnosisService {

    private final KieContainer kieContainer;

    public DiagnosisService(KieContainer kieContainer) {
        this.kieContainer = kieContainer;
    }

    public List<TreatmentPlan> diagnose(DiagnosisRequest request) {
        KieSession kieSession = kieContainer.newKieSession();
        List<TreatmentPlan> results = new ArrayList<>();

        try {
            if (request.getState() != null) {
                kieSession.insert(request.getState());
                if (request.getState().getSymptoms() != null) {
                    for (Symptom symptom : request.getState().getSymptoms()) {
                        kieSession.insert(symptom);
                    }
                }
            }

            if (request.getWeatherMeasurements() != null) {
                EntryPoint weatherStream = kieSession.getEntryPoint("weather-stream");
                for (WeatherMeasurement wm : request.getWeatherMeasurements()) {
                    weatherStream.insert(wm);
                }
            }

            kieSession.addEventListener(new DebugAgendaEventListener());

            activateGroup(kieSession, "cep-rules");
            activateGroup(kieSession, "level1-symptom-mapping");
            activateGroup(kieSession, "level2-diagnosis-confirmation");
            activateGroup(kieSession, "level3-treatment-strategy");

            kieSession.getObjects(obj -> obj instanceof TreatmentPlan)
                    .forEach(obj -> results.add((TreatmentPlan) obj));

        } finally {
            kieSession.dispose();
        }

        return results;
    }

    private void activateGroup(KieSession session, String groupName) {
        session.getAgenda().getAgendaGroup(groupName).setFocus();
        session.fireAllRules();
    }
}