package mts.mtech.controller;

import mts.mtech.dto.BookingDto;
import mts.mtech.service.BookingService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/booking")
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public String booking(@RequestBody BookingDto request){
        bookingService.bookingService(request);
        return "Success";
    }
}
