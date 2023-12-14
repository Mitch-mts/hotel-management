package mts.mtech.delegates;

import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class GenerateBusinessKeyService implements JavaDelegate {
    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        String idNumber = (String) delegateExecution.getVariable("idNumber");
        log.info("business key IdNumber------->>{}", idNumber);
        String businessKey = "MTS-" + idNumber.replace("-","").replaceAll("\\s","");
        log.info("businessKey----->>{}", businessKey);
        delegateExecution.setProcessBusinessKey(businessKey);
    }
}
