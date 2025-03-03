package mts.mtech.delegates;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;

import java.io.Serializable;

public class DisplayAvailableRoomsService implements JavaDelegate, Serializable {
    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {

    }
}
