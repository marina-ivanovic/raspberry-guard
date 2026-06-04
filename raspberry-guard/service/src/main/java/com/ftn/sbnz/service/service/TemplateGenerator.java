package com.ftn.sbnz.service.service;

import org.drools.template.DataProvider;
import org.drools.template.DataProviderCompiler;
import org.drools.template.objects.ArrayDataProvider;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class TemplateGenerator {

    public static void main(String[] args) {
        try {
            InputStream templateStream = TemplateGenerator.class.getResourceAsStream("/rules/pesticide-recommendation.drt");
            InputStream csvStream = TemplateGenerator.class.getResourceAsStream("/rules/pesticides.csv");

            if (templateStream == null || csvStream == null) {
                System.out.println("Greška: Nisu pronađeni fajlovi. Da li si uradio 'mvn clean install' za kjar?");
                return;
            }

            BufferedReader reader = new BufferedReader(new InputStreamReader(csvStream));
            List<String[]> rows = new ArrayList<>();
            String line = reader.readLine();

            while ((line = reader.readLine()) != null) {
                String[] values = line.split(",");
                for (int i = 0; i < values.length; i++) {
                    values[i] = values[i].trim();
                }
                rows.add(values);
            }

            DataProvider dataProvider = new ArrayDataProvider(rows.toArray(new String[0][]));
            DataProviderCompiler compiler = new DataProviderCompiler();
            String generatedDrl = compiler.compile(dataProvider, templateStream);

            System.out.println("====== GENERISANA PRAVILA IZ TEMPLEJTA ======");
            System.out.println(generatedDrl);
            System.out.println("=============================================");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}