package mts.mtech.dto;

import lombok.Builder;
import lombok.Data;
import lombok.ToString;
import mts.mtech.enums.RoomType;


@Data
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
