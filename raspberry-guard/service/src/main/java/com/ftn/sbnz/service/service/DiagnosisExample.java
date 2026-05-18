package com.ftn.sbnz.service.service;

import com.ftn.sbnz.model.enums.GrowthPhase;
import com.ftn.sbnz.model.enums.SymptomLocation;
import com.ftn.sbnz.model.enums.Variety;
import com.ftn.sbnz.model.model.RaspberryState;
import com.ftn.sbnz.model.model.Symptom;

public class DiagnosisExample {

    public static void main(String[] args) {
        // --- Scenario 1: Didymella applanata ---
        System.out.println("=== Scenario 1: Ljubičasta pegavost ===");

        RaspberryState state1 = new RaspberryState(Variety.MEEKER, GrowthPhase.LEAFING, 3);
        state1.addSymptom(new Symptom("ljubicasta_pega", SymptomLocation.STEM, 7));
        state1.addSymptom(new Symptom("pukla_kora", SymptomLocation.STEM, 5));

        printDiagnosis(state1);

        // --- Scenario 2: Botrytis cinerea ---
        System.out.println("\n=== Scenario 2: Siva plesan ===");

        RaspberryState state2 = new RaspberryState(Variety.POLKA, GrowthPhase.FRUITING, 5);
        state2.addSymptom(new Symptom("mekani_plod", SymptomLocation.FRUIT, 8));
        state2.addSymptom(new Symptom("siva_prevlaka", SymptomLocation.FRUIT, 9));

        printDiagnosis(state2);

        // --- Scenario 3: Tetranychus urtice ---
        System.out.println("\n=== Scenario 3: Žuti voćni pauk ===");

        RaspberryState state3 = new RaspberryState(Variety.WILLAMETTE, GrowthPhase.FRUITING, 4);
        state3.addSymptom(new Symptom("belicaste_pegice", SymptomLocation.LEAF, 6));
        state3.addSymptom(new Symptom("paukova_mreza", SymptomLocation.LEAF, 7));

        printDiagnosis(state3);

        // --- Scenario 4: Berba - hemija zabranjena ---
        System.out.println("\n=== Scenario 4: Botrytis tokom berbe ===");

        RaspberryState state4 = new RaspberryState(Variety.TULAMEEN, GrowthPhase.HARVEST, 6);
        state4.addSymptom(new Symptom("mekani_plod", SymptomLocation.FRUIT, 8));
        state4.addSymptom(new Symptom("siva_prevlaka", SymptomLocation.FRUIT, 9));

        printDiagnosis(state4);
    }

    private static void printDiagnosis(RaspberryState state) {
        System.out.println("Unos: " + state);
        System.out.println("(Pokrenuti DiagnosisService.diagnose(state) za rezultate)");
    }
}
