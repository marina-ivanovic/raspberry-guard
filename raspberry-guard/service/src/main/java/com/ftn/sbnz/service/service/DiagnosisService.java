package com.ftn.sbnz.service.service;

import com.ftn.sbnz.model.model.*;
import org.kie.api.runtime.KieContainer;
import org.kie.api.runtime.KieSession;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DiagnosisService {

    private final KieContainer kieContainer;

    public DiagnosisService(KieContainer kieContainer) {
        this.kieContainer = kieContainer;
    }

    public List<TreatmentPlan> diagnose(RaspberryState state) {
        KieSession kieSession = kieContainer.newKieSession();
        List<TreatmentPlan> results = new ArrayList<>();

        try {
            kieSession.insert(state);
            for (Symptom symptom : state.getSymptoms()) {
                kieSession.insert(symptom);
            }

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
