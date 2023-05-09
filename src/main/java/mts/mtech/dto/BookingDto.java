package mts.mtech.dto;

import lombok.*;
import mts.mtech.enums.RoomType;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class BookingDto {
    private String name;
    private String idNumber;
    private String amount;
    private Long daysOfStay;
    private RoomType roomType;
    private Integer age;
}
