package mts.mtech.delegates;

import lombok.extern.slf4j.Slf4j;
import mts.mtech.domain.Guest;
import mts.mtech.persistence.GuestRepository;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@Slf4j
public class GetGuestDetailsService implements JavaDelegate {
    private final GuestRepository guestRepository;

    public GetGuestDetailsService(GuestRepository guestRepository) {
        this.guestRepository = guestRepository;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        try{
            String name = (String) delegateExecution.getVariable("name");
            Integer age = (Integer) delegateExecution.getVariable("age");
            String amount = (String) delegateExecution.getVariable("amount");
            String idNumber = (String) delegateExecution.getVariable("idNumber");

            Guest guest = Guest.builder()
                        .idNumber(idNumber)
                        .age(age)
                        .amount(new BigDecimal(amount))
                        .name(name)
                        .build();

            log.info("guest----->>{}", guest);

            Guest result = guestRepository.save(guest);
            log.info("db result----->>{}", result);

        }catch (Exception e){
            log.error("GetGuestDetailsService error------->{}",e.getMessage());
            throw new RuntimeException(e);
        }
    }
}
