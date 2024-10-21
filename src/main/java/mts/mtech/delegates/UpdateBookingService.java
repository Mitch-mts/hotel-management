package mts.mtech.delegates;

import com.amazonaws.util.StringUtils;
import lombok.extern.slf4j.Slf4j;
import mts.mtech.domain.Booking;
import mts.mtech.errorhandling.exception.RecordNotFoundException;
import mts.mtech.persistence.BookingRepository;
import mts.mtech.status.BookingStatus;
import mts.mtech.utils.Constants;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

@Component(value = "UpdateBookingService")
@Slf4j
public class UpdateBookingService implements JavaDelegate {
    private final BookingRepository bookingRepository;

    public UpdateBookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        Booking bookingData = (Booking) delegateExecution.getVariable("booking");
        String payment = (String) delegateExecution.getVariable("payment");

        Booking booking = bookingRepository.findById(bookingData.getId())
                .orElseThrow(() -> new RecordNotFoundException(Constants.NOT_FOUND));

        booking.setBookingStatus(!StringUtils.isNullOrEmpty(payment) && payment.equals("complete") ? BookingStatus.COMPLETE : BookingStatus.CANCELLED);
        bookingRepository.save(booking);

    }
}
