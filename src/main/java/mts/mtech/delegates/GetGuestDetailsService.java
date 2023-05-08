package mts.mtech.delegates;

import mts.mtech.domain.Guest;
import mts.mtech.persistence.GuestRepository;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;

import java.math.BigDecimal;

public class GetGuestDetailsService implements JavaDelegate {
    private final GuestRepository guestRepository;

    public GetGuestDetailsService(GuestRepository guestRepository) {
        this.guestRepository = guestRepository;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        String name = (String) delegateExecution.getVariable("name");
        Integer age = (Integer) delegateExecution.getVariable("age");
        String amount = (String) delegateExecution.getVariable("amount");
        String idNumebr = (String) delegateExecution.getVariable("idNumber");

        Guest guest = new Guest();
        guest.setAge(age);
        guest.setName(name);
        guest.setIdNumber(idNumebr);
        guest.setAmount(new BigDecimal(amount));

        guestRepository.save(guest);

    }
}
