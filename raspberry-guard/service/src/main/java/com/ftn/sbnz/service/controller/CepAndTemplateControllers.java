package com.ftn.sbnz.service.controller;

import com.ftn.sbnz.model.model.RiskAlert;
import com.ftn.sbnz.model.model.TreatmentPlan;
import com.ftn.sbnz.model.model.WeatherMeasurement;

import org.kie.api.runtime.KieSession;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

import com.ftn.sbnz.service.service.CepService;
import com.ftn.sbnz.service.service.TemplateService;

@RestController
@RequestMapping("/api/cep")
class CepController {

    private final CepService cepService;

    CepController(CepService cepService) {
        this.cepService = cepService;
    }

    @PostMapping("/analyze")
    public List<RiskAlert> analyzeWeather(@RequestBody List<WeatherMeasurement> measurements) {
        return cepService.analyzeWeather(measurements);
    }
}

@RestController
@RequestMapping("/api/template")
class TemplateController {

    private final TemplateService templateService;

    TemplateController(TemplateService templateService) {
        this.templateService = templateService;
    }

    @PostMapping("/diagnose")
    public List<TreatmentPlan> diagnoseWithTemplate(
            @RequestParam String issueName,
            @RequestParam String currentPhase) {

        KieSession session = templateService.buildSessionFromTemplate();
        List<TreatmentPlan> results = new ArrayList<>();

        try {
            com.ftn.sbnz.model.model.Diagnosis dx = new com.ftn.sbnz.model.model.Diagnosis(
                issueName,
                com.ftn.sbnz.model.enums.PathogenType.DISEASE,
                0.95
            );
            com.ftn.sbnz.model.model.RaspberryState state = new com.ftn.sbnz.model.model.RaspberryState();
            state.setCurrentPhase(com.ftn.sbnz.model.enums.GrowthPhase.valueOf(currentPhase));

            session.insert(dx);
            session.insert(state);
            session.getAgenda().getAgendaGroup("level3-treatment-strategy").setFocus();
            session.fireAllRules();

            session.getObjects(obj -> obj instanceof TreatmentPlan)
                    .forEach(obj -> results.add((TreatmentPlan) obj));
        } finally {
            session.dispose();
        }

        return results;
    }
}
