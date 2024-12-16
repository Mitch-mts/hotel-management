package mts.mtech.delegates;

import camundajar.impl.scala.Int;
import com.amazonaws.util.StringUtils;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

@Component(value = "VerifyBookingService")
@Slf4j
public class VerifyBookingService implements JavaDelegate {
    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        String name = (String) delegateExecution.getVariable("name");
        String isRoomAvailable = (String) delegateExecution.getVariable("roomAvailable");
        int daysOfStay = (Integer) delegateExecution.getVariable("daysOfStay");
        int guestAge = (Integer) delegateExecution.getVariable("age");

        if (isRoomAvailable.equals("YES") &&
                !StringUtils.isNullOrEmpty(name) &&
                daysOfStay > 0 &&
                guestAge > 17) {
            delegateExecution.setVariable("approved", "Yes");
        } else {
            delegateExecution.setVariable("approved", "No");
        }

    }
}
