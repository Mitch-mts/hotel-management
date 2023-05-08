package mts.mtech.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "room")
@TableGenerator(name = "room_id_generator",
        table = "id_generator",
        pkColumnName = "id_name",
        pkColumnValue = "room",
        valueColumnName = "id_value")
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Room implements Serializable {
    @Id
    @GeneratedValue(generator = "room_id_generator")
    @Column(nullable = false, updatable = false)
    private Long id;

    @Column
    private String roomType;

    @Column
    private boolean isAvailable;

    @Column
    private BigDecimal amount;

    @OneToOne
    private Guest guestId;
}
