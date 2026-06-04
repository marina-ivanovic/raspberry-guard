package com.ftn.sbnz.model.model;

import org.kie.api.definition.type.Role;
import org.kie.api.definition.type.Timestamp;

import java.util.Date;

@Role(Role.Type.EVENT)
@Timestamp("activeSince")
public class RiskAlert {

    private String pathogen;
    private String riskLevel;
    private String recommendation;
    private Date activeSince;

    public RiskAlert() {
        this.activeSince = new Date();
    }

    public RiskAlert(String pathogen, String riskLevel, String recommendation) {
        this.pathogen = pathogen;
        this.riskLevel = riskLevel;
        this.recommendation = recommendation;
        this.activeSince = new Date();
    }

    public String getPathogen() { return pathogen; }
    public void setPathogen(String pathogen) { this.pathogen = pathogen; }

    public String getRiskLevel() { return riskLevel; }
    public void setRiskLevel(String riskLevel) { this.riskLevel = riskLevel; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public Date getActiveSince() { return activeSince; }
    public void setActiveSince(Date activeSince) { this.activeSince = activeSince; }

    @Override
    public String toString() {
        return "RiskAlert{pathogen='" + pathogen + "', riskLevel='" + riskLevel
                + "', recommendation='" + recommendation + "'}";
    }
}
