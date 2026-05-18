package com.ftn.sbnz.service.controller;

import com.ftn.sbnz.model.model.RaspberryState;
import com.ftn.sbnz.model.model.TreatmentPlan;
import com.ftn.sbnz.service.service.DiagnosisService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/diagnosis")
public class DiagnosisController {

    private final DiagnosisService diagnosisService;

    @Autowired
    public DiagnosisController(DiagnosisService diagnosisService) {
        this.diagnosisService = diagnosisService;
    }

    @PostMapping
    public ResponseEntity<List<TreatmentPlan>> getDiagnosis(@RequestBody RaspberryState state) {
        try {
            List<TreatmentPlan> treatmentPlans = diagnosisService.diagnose(state);
            return new ResponseEntity<>(treatmentPlans, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}