package mts.mtech.delegates;

import lombok.extern.slf4j.Slf4j;
import mts.mtech.domain.Booking;
import mts.mtech.errorhandling.exception.RecordNotFoundException;
import mts.mtech.persistence.BookingRepository;
import mts.mtech.status.BookingStatus;
import mts.mtech.utils.Constants;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

@Component(value = "ProcessPaymentService")
@Slf4j
public class ProcessPaymentService implements JavaDelegate {
    private final BookingRepository bookingRepository;

    public ProcessPaymentService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.info("process payments ------ approved: {}", delegateExecution.getVariable("approved"));

        Booking booking = (Booking) delegateExecution.getVariable("booking");
        var bookingData = bookingRepository.findById(booking.getId()).orElseThrow(() -> new RecordNotFoundException(Constants.NOT_FOUND));

        if(bookingData.getBookingStatus().equals(BookingStatus.ACTIVE)) {
            //TODO make payment implementation
            delegateExecution.setVariable("payment", "complete");
        }
        delegateExecution.setVariable("payment", "failed");

    }
}
