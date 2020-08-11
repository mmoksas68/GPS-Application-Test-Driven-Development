import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import java.util.HashMap;
import java.util.Map;

public class DisabledPermissionTest {
    @Test
    public void withoutLocationPermission() throws InterruptedException {
        String url = "https://gps-app-tdd.herokuapp.com/";
        ChromeOptions options = new ChromeOptions();
        Map<String, Object> prefs = new HashMap<String, Object>();
        prefs.put("profile.default_content_setting_values.geolocation", 2);
        options.setExperimentalOption("prefs", prefs);
        WebDriver driverWithoutPermission = new ChromeDriver(options);
        driverWithoutPermission.manage().window().maximize();
        driverWithoutPermission.get(url);

        driverWithoutPermission.findElement(By.id("updateCurrentLocation")).click();
        Thread.sleep(4000);

        Assert.assertEquals(driverWithoutPermission.findElement(By.id("permissionDenied")).getText(),
                      "You need to enable locations");
        driverWithoutPermission.quit();
    }
}
