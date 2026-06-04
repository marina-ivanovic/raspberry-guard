package com.ftn.sbnz.service.service;

import com.ftn.sbnz.model.model.Pesticide;

import java.util.ArrayList;
import java.util.List;

public class PesticideDataProvider {

    public static List<Pesticide> getActivePesticides() {
        List<Pesticide> pesticides = new ArrayList<>();

        pesticides.add(new Pesticide(
            "Quadris", "Azoxystrobin", "Didymella applanata",
            1.0, "L/ha", 14, "HARVEST", "ACTIVE", "FUNGICIDE"
        ));
        pesticides.add(new Pesticide(
            "Switch", "Cyprodinil + Fludioxonil", "Botrytis cinerea",
            0.8, "kg/ha", 7, "HARVEST", "ACTIVE", "FUNGICIDE"
        ));
        pesticides.add(new Pesticide(
            "Teldor", "Fenhexamid", "Botrytis cinerea",
            1.0, "kg/ha", 3, "HARVEST", "ACTIVE", "FUNGICIDE"
        ));
        pesticides.add(new Pesticide(
            "Signum", "Boscalid + Pyraclostrobin", "Leptosphaeria coniothyrium",
            1.0, "kg/ha", 14, "HARVEST", "ACTIVE", "FUNGICIDE"
        ));
        pesticides.add(new Pesticide(
            "Kaptan 50 WP", "Captan", "Elsinoe venetum",
            2.5, "kg/ha", 7, "HARVEST", "ACTIVE", "FUNGICIDE"
        ));

        pesticides.add(new Pesticide(
            "Karate Zeon", "Lambda-cyhalothrin", "Anthonomus rubi",
            0.2, "L/ha", 7, "FLOWERING", "ACTIVE", "INSECTICIDE"
        ));
        pesticides.add(new Pesticide(
            "Calypso", "Thiacloprid", "Byturus tomentosus",
            0.3, "L/ha", 7, "FLOWERING", "ACTIVE", "INSECTICIDE"
        ));
        pesticides.add(new Pesticide(
            "Actara", "Thiamethoxam", "Aphididae",
            0.2, "kg/ha", 14, "FLOWERING", "ACTIVE", "INSECTICIDE"
        ));

        pesticides.add(new Pesticide(
            "Vertimec", "Abamectin", "Tetranychus urtice",
            0.75, "L/ha", 14, "HARVEST", "ACTIVE", "ACARICIDE"
        ));

        pesticides.add(new Pesticide(
            "Kreozan", "Kreozot", "Didymella applanata",
            2.0, "L/ha", 30, "HARVEST", "BANNED", "FUNGICIDE"
        ));

        return pesticides.stream()
                .filter(p -> "ACTIVE".equals(p.getStatus()))
                .collect(java.util.stream.Collectors.toList());
    }
}
