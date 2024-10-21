package mts.mtech.delegates;

import lombok.extern.slf4j.Slf4j;
import mts.mtech.domain.Booking;
import mts.mtech.domain.Guest;
import mts.mtech.enums.RoomType;
import mts.mtech.persistence.BookingRepository;
import mts.mtech.persistence.GuestRepository;
import mts.mtech.status.BookingStatus;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component(value = "CreateBookingService")
@Slf4j
public class CreateBookingService implements JavaDelegate {
    private final BookingRepository bookingRepository;
    private final GuestRepository guestRepository;

    public CreateBookingService(BookingRepository bookingRepository, GuestRepository guestRepository) {
        this.bookingRepository = bookingRepository;
        this.guestRepository = guestRepository;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        try {
            Long guestId = (Long) delegateExecution.getVariable("guestId");
            RoomType roomType = (RoomType) delegateExecution.getVariable("roomType");
            Long daysOfStay = (Long) delegateExecution.getVariable("daysOfStay");

            Guest guest = guestRepository.getReferenceById(guestId);

            Booking booking = Booking.builder()
                    .bookingStatus(BookingStatus.ACTIVE)
                    .bookingOpenDate(LocalDateTime.now())
                    .roomType(roomType)
                    .daysOfStay(daysOfStay)
                    .guest(guest)
                    .build();

            Booking bookingResult = bookingRepository.save(booking);
            log.info("booking result {}", bookingResult);
            delegateExecution.setVariable("booking", bookingResult);
        } catch (Exception e) {
            log.error("CreateBookingService error------->{}",e.getMessage());
            String message = "CreateBookingService error------->" + e.getMessage();
            throw new RuntimeException(message);
        }
    }
}
