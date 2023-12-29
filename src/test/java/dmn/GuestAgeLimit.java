package dmn;

import org.camunda.bpm.dmn.engine.DmnDecision;
import org.camunda.bpm.dmn.engine.DmnDecisionRuleResult;
import org.camunda.bpm.dmn.engine.DmnDecisionTableResult;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.test.Deployment;
import org.camunda.bpm.engine.variable.VariableMap;
import org.camunda.bpm.engine.variable.Variables;
import org.camunda.bpm.extension.junit5.test.ProcessEngineExtension;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvFileSource;
import org.junit.jupiter.params.provider.CsvSource;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(ProcessEngineExtension.class)
@Deployment(resources = {"dmn/guest_age_limit.dmn"})
public class GuestAgeLimit {
    private ProcessEngine processEngine;

    @DisplayName("guest Age limit DMN")
    @ParameterizedTest(name = "when request with age: {0} then accepted: {1}")
    @CsvFileSource(resources = "/csv_files/guest_age_limit.csv", delimiter = '|', numLinesToSkip = 1)
    public void dmnGuestAgeLimit(Integer age, String accepted) {
        final VariableMap variableMap = Variables.putValue("age", age);

        final DmnDecisionTableResult guestAgeLimitResultDmn = processEngine.getDecisionService()
                .evaluateDecisionTableByKey("guest_age_limit", variableMap);
        final DmnDecisionRuleResult dmnDecisionRuleResult = guestAgeLimitResultDmn.getFirstResult();

        assertThat(guestAgeLimitResultDmn).isNotNull();
        assertThat(dmnDecisionRuleResult).isNotNull();
        assertThat(accepted).isEqualTo(dmnDecisionRuleResult.get("accepted"));
    }
}
