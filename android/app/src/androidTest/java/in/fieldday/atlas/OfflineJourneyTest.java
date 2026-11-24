package in.fieldday.atlas;

import androidx.test.core.app.ActivityScenario;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import org.junit.Test;
import org.junit.runner.RunWith;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import static org.junit.Assert.*;

@RunWith(AndroidJUnit4.class)
public class OfflineJourneyTest {
    String js(ActivityScenario<MainActivity> app,String expression) throws Exception {
        CountDownLatch latch=new CountDownLatch(1);AtomicReference<String> result=new AtomicReference<>();
        app.onActivity(a->a.web.evaluateJavascript(expression,r->{result.set(r);latch.countDown();}));
        assertTrue(latch.await(8,TimeUnit.SECONDS));return result.get();
    }
    void until(ActivityScenario<MainActivity> app,String condition) throws Exception {
        long end=System.currentTimeMillis()+20000;
        while(System.currentTimeMillis()<end){if("true".equals(js(app,"Boolean("+condition+")")))return;Thread.sleep(150);}
        fail("Timed out: "+condition+" at "+js(app,"location.href")+"; "+js(app,"document.body.innerText.slice(0,240)"));
    }
    void tab(ActivityScenario<MainActivity> app,int index){app.onActivity(a->a.tabs[index].performClick());}
    @Test public void offlineAtlasNotebookGuideLabAndPlanner() throws Exception {
        try(ActivityScenario<MainActivity> app=ActivityScenario.launch(MainActivity.class)){
            until(app,"document.documentElement.dataset.screen==='discover' && document.querySelector('#catalog article')");
            tab(app,1);until(app,"document.documentElement.dataset.screen==='atlas'");
            js(app,"document.querySelector('#atlas-query').value='Lonar';document.querySelector('#atlas-query').dispatchEvent(new Event('input'))");
            until(app,"document.querySelector('#place-lonar img')?.naturalWidth>0");
            js(app,"document.querySelector('#place-lonar .card-actions button').click()");
            tab(app,4);until(app,"document.documentElement.dataset.screen==='saved' && document.querySelector('#atlas-count').textContent.includes('saved') && document.querySelector('#place-lonar')");
            js(app,"document.querySelector('#place-lonar .card-actions a').click()");
            until(app,"location.pathname.endsWith('/places/lonar/') && document.querySelector('h1')?.textContent==='Lonar Crater'");
            app.onActivity(MainActivity::onBackPressed);until(app,"document.documentElement.dataset.screen==='saved'");
            tab(app,3);until(app,"document.querySelector('[data-geo-model=deccan]')");
            js(app,"document.querySelector('[data-geo-model=deccan]').click();document.querySelector('[data-geo-stage=\"1\"]').click()");
            until(app,"document.querySelector('#lab-mount canvas')?.getAttribute('aria-label').includes('First flow')");
            tab(app,2);until(app,"document.documentElement.dataset.screen==='plan'");
            js(app,"document.querySelector('#trip button[type=submit]').click()");
            until(app,"document.querySelector('#output .timeline')?.textContent.includes('Return to Adilabad railway station')");
        }
    }
}
