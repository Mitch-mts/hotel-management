package mts.mtech.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import mts.mtech.enums.RoomType;
import mts.mtech.status.BookingStatus;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "booking")
@TableGenerator(name = "booking_id_generator",
        table = "id_generator",
        pkColumnName = "id_name",
        pkColumnValue = "booking",
        valueColumnName = "id_value")
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Booking implements Serializable {

    @Id
    @GeneratedValue(generator = "booking_up_id_generator")
    @Column(nullable = false, updatable = false)
    private Long id;

    @OneToOne
    private Guest guest;

    @Enumerated(EnumType.STRING)
    private RoomType roomType;

    @Column
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime bookingOpenDate;

    @Column
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime bookingCloseDate;

    @Column
    private Long daysOfStay;

    @Column
    private BookingStatus bookingStatus;

}
