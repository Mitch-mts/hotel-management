package mts.mtech.domain;

import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Table(name = "guest")
@TableGenerator(name = "guest_id_generator",
        table = "id_generator",
        pkColumnName = "id_name",
        pkColumnValue = "guest",
        valueColumnName = "id_value")
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Guest implements Serializable {
    @Id
    @GeneratedValue(generator = "guest_id_generator")
    @Column(nullable = false, updatable = false)
    private Long id;

    @Column
    private String name;

    @Column
    private BigDecimal amount;

    @Column
    private Integer age;

    @Column
    private String idNumber;
}
