import org.junit.Assert;
import org.junit.Before;
import org.junit.After;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class GpsAppTest {


    public WebDriver driver;
    protected static String url = "https://gps-app-tdd.herokuapp.com/";

    @Before
    public void setUp() {
        System.setProperty("webdriver.chrome.driver", "chromedriver.exe");
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.get(url);
    }

    @Test
    public void enterCoordinates() throws InterruptedException {
        tryCity("39", "40", "Elâzığ");
        tryCity("39", "32", "Ankara");
        tryCity("40", "-74", "New Jersey");
    }


    public void tryCity(String lat, String lng, String city) throws InterruptedException {
        driver.findElement(By.id("latInput")).clear();
        driver.findElement(By.id("latInput")).sendKeys(lat);
        driver.findElement(By.id("lngInput")).clear();
        driver.findElement(By.id("lngInput")).sendKeys(lng);
        driver.findElement(By.id("sendCoordinateButton")).click();

        Thread.sleep(1000);

        Assert.assertEquals(driver.findElement(By.id("enteredCity")).getText(), "Entered coordinates are in " + city);
    }

    enum  InvalidOptions{
        INVALID_LATITUDE,
        INVALID_LONGITUDE,
        LOCATION_OUTSIDE_CITY
    }

    @Test
    public void invalidCoordinates() throws InterruptedException {
        tryInvalidCoordinates("a", "90", InvalidOptions.INVALID_LATITUDE);
        tryInvalidCoordinates("-180", "90", InvalidOptions.INVALID_LATITUDE);
        tryInvalidCoordinates("40", "200", InvalidOptions.INVALID_LONGITUDE);
        tryInvalidCoordinates("40", "b", InvalidOptions.INVALID_LONGITUDE);
        tryInvalidCoordinates("", "90", InvalidOptions.INVALID_LATITUDE);
        tryInvalidCoordinates("40", "", InvalidOptions.INVALID_LONGITUDE);
        tryInvalidCoordinates("0", "0", InvalidOptions.LOCATION_OUTSIDE_CITY);
    }

    public void tryInvalidCoordinates(String lat, String lng, InvalidOptions option) throws InterruptedException{
        driver.findElement(By.id("latInput")).clear();
        driver.findElement(By.id("latInput")).sendKeys(lat);
        driver.findElement(By.id("lngInput")).clear();
        driver.findElement(By.id("lngInput")).sendKeys(lng);
        driver.findElement(By.id("sendCoordinateButton")).click();
        Thread.sleep(1000);

        switch (option)
        {
            case INVALID_LATITUDE:
                Assert.assertEquals(driver.findElement(By.id("latitudeValidation")).getText(), "Invalid latitude");
                break;
            case INVALID_LONGITUDE:
                Assert.assertEquals(driver.findElement(By.id("longitudeValidation")).getText(), "Invalid longitude");
                break;
            case LOCATION_OUTSIDE_CITY:
                Assert.assertEquals(driver.findElement(By.id("currentCityValidation")).getText(), "Couldn't find a city with given coordinates");
                break;
        }
        driver.get(url);
    }

    @Test
    public void getCurrentLocation() throws InterruptedException {
        driver.findElement(By.id("updateCurrentLocation")).click();
        Thread.sleep(1500);

        Assert.assertEquals(driver.findElement(By.id("currentCity")).getText(), "Current coordinates are in Ankara");
        Assert.assertTrue(driver.findElement(By.id("currentLat")).getText().contains("39"));
        Assert.assertTrue(driver.findElement(By.id("currentLng")).getText().contains("32"));
    }

    @Test
    public void getDistanceToNearestCity() throws InterruptedException{
        Assert.assertEquals(driver.findElement(By.id("nearestCityInformation")).getAttribute("className"), "d-none");

        driver.findElement(By.id("updateCurrentLocation")).click();
        Thread.sleep(3000);

        Assert.assertNotEquals(driver.findElement(By.id("nearestCityInformation")).getAttribute("className"), "d-none");
        Assert.assertNotEquals(driver.findElement(By.id("nearestDistance")).getText(), "");
        Assert.assertNotEquals(driver.findElement(By.id("nearestLat")).getText(), "");
        Assert.assertNotEquals(driver.findElement(By.id("nearestLng")).getText(), "");
    }

    @Test
    public void getDistanceToEarthCenter() throws InterruptedException {
        Assert.assertEquals(driver.findElement(By.id("currentCityEarthCenterInformation")).getAttribute("className"), "d-none");
        Assert.assertEquals(driver.findElement(By.id("enteredCityEarthCenterInformation")).getAttribute("className"), "d-none");

        driver.findElement(By.id("updateCurrentLocation")).click();
        Thread.sleep(3000);

        driver.findElement(By.id("latInput")).sendKeys("39");
        driver.findElement(By.id("lngInput")).sendKeys("32");
        driver.findElement(By.id("sendCoordinateButton")).click();
        Thread.sleep(2000);

        Assert.assertNotEquals(driver.findElement(By.id("currentCityEarthCenterInformation")).getAttribute("className"), "d-none");
        Assert.assertNotEquals(driver.findElement(By.id("enteredCityEarthCenterInformation")).getAttribute("className"), "d-none");
        Assert.assertNotEquals(driver.findElement(By.id("earthCenterCurrentLocDistance")).getText(), "");
        Assert.assertNotEquals(driver.findElement(By.id("earthCenterEnteredLocDistance")).getText(), "");
    }

    @After
    public void tearDown() throws InterruptedException {
        Thread.sleep(1000);
        driver.quit();
    }
}