package mts.mtech.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import mts.mtech.dto.BookingDto;
import mts.mtech.service.BookingService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/booking")
@Tag(name = "Hotel Booking APIs", description = "APIs for hotel booking")
@Slf4j
@CrossOrigin
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @Operation(summary = "Initialise Hotel booking", description = "API initiates booking process for a hotel room." +
            "\n Available room types are: \n" +
            "                              <ul>" +
            "                               <li>STANDARD</li>\n" +
            "                              <li>LUXURY</li>\n" +
            "                              <li>STANDARD_TWIN</li>" +
            "                               </ul>")
    public String booking(@RequestBody BookingDto request){
        bookingService.bookingService(request);
        return "Success";
    }
}
