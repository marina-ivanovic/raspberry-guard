package com.ftn.sbnz.service.service;

import com.ftn.sbnz.model.model.Pesticide;
import org.drools.template.ObjectDataCompiler;
import org.kie.api.io.ResourceType;
import org.kie.api.runtime.KieSession;
import org.kie.internal.utils.KieHelper;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.List;

@Service
public class TemplateService {

    public KieSession buildSessionFromTemplate() {
        InputStream templateStream = getClass()
                .getResourceAsStream("/rules/pesticide-recommendation.drt");

        if (templateStream == null) {
            throw new RuntimeException("Template fajl nije pronadjen: /rules/pesticide-recommendation.drt");
        }

        // Uzmi aktivne preparate
        List<Pesticide> pesticides = PesticideDataProvider.getActivePesticides();

        System.out.println("[TEMPLATE] Generisanje pravila za " + pesticides.size() + " aktivnih preparata...");

        ObjectDataCompiler compiler = new ObjectDataCompiler();
        String generatedDrl = compiler.compile(pesticides, templateStream);

        System.out.println("[TEMPLATE] Generisani DRL:\n" + generatedDrl);

        KieHelper kieHelper = new KieHelper();
        kieHelper.addContent(generatedDrl, ResourceType.DRL);

        return kieHelper.build().newKieSession();
    }
}
