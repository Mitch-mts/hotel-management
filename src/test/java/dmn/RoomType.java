package dmn;

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

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(ProcessEngineExtension.class)
@Deployment(resources = {"dmn/roomType.dmn"})
public class RoomType {
    private ProcessEngine processEngine;

    @DisplayName("guest Age limit DMN")
    @ParameterizedTest(name = "when request with roomType: {0}, amount: {1} then roomAvailable: {2}")
    @CsvFileSource(resources = "/csv_files/roomType.csv", delimiter = '|', numLinesToSkip = 1)
    void roomTypeDmnTest(String roomType, String amount, String roomAvailable) {
        final VariableMap variableMap = Variables.putValue("roomType", roomType)
                .putValue("amount", amount);

        final DmnDecisionTableResult roomTypeResultDmn = processEngine.getDecisionService()
                .evaluateDecisionTableByKey("room_type", variableMap);
        final DmnDecisionRuleResult dmnDecisionRuleResult = roomTypeResultDmn.getFirstResult();

        assertThat(roomTypeResultDmn).isNotNull();
        assertThat(dmnDecisionRuleResult).isNotNull();
        assertThat(roomAvailable).isEqualTo(dmnDecisionRuleResult.get("roomAvailable"));
    }
}
