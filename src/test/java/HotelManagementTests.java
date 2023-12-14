import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class HotelManagementTests {
    @Test
    void shouldGenerateBusinessKeyFromIdNumber() {
        String idNumber = "63-1521624 X 18";
        String businessKey = "MTS-" + idNumber.replace("-","").replaceAll("\\s","");
        System.out.println(businessKey);
    }
}
