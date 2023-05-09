package mts.mtech.delegates;

import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;

@Slf4j
public class GenerateBusinesskeyService implements JavaDelegate {
    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        String IdNumber = (String) delegateExecution.getVariable("IdNumber");
        log.info("business key IdNumber------->>{}", IdNumber);
        String businessKey = "MTS-" + IdNumber.substring(0,3);
        log.info("businessKey----->>{}", businessKey);
        delegateExecution.setProcessBusinessKey(businessKey);
    }
}
