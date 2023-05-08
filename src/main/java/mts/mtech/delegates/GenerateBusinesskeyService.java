package mts.mtech.delegates;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;

public class GenerateBusinesskeyService implements JavaDelegate {
    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        String IdNumber = (String) delegateExecution.getVariable("IdNumber");
        String businesskey = "MTS-" + IdNumber.substring(0,3);
        delegateExecution.setProcessBusinessKey(businesskey);
    }
}
