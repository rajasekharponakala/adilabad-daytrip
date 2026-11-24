package in.fieldday.atlas;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.print.PrintManager;
import android.view.Gravity;
import android.view.View;
import android.webkit.*;
import android.widget.*;
import androidx.webkit.WebViewAssetLoader;
import java.io.ByteArrayInputStream;
import java.util.Collections;
import java.util.ArrayList;

public final class MainActivity extends Activity {
    static final String HOST="appassets.androidplatform.net", BASE="https://"+HOST+"/assets/";
    static final String[] TABS={"Discover","Atlas","Plan","3D Lab","Saved"}, HASH={"home","places","planner","geo-lab","saved"}, ICONS={"◇","⌕","↗","⬡","☆"};
    static final int DARK=Color.rgb(29,56,44), PAPER=Color.rgb(248,244,233), LIME=Color.rgb(222,236,134);
    WebView web; TextView heading,back; LinearLayout navigation; final LinearLayout[] tabs=new LinearLayout[TABS.length];
    private int selected;
    // Chromium can skip fragment entries without a WebView user gesture, including
    // native tab presses. Maintain the app's own destination history instead.
    private final ArrayList<String> trail=new ArrayList<>();
    int dp(int value){return Math.round(getResources().getDisplayMetrics().density*value);}
    TextView label(String value,int size,int color,boolean bold){TextView v=new TextView(this);v.setText(value);v.setTextSize(size);v.setTextColor(color);v.setGravity(Gravity.CENTER);if(bold)v.setTypeface(Typeface.DEFAULT,Typeface.BOLD);return v;}
    @Override public void onCreate(Bundle state){super.onCreate(state);
        LinearLayout root=new LinearLayout(this);root.setOrientation(LinearLayout.VERTICAL);root.setBackgroundColor(DARK);setContentView(root);
        root.setOnApplyWindowInsetsListener((v,insets)->{
            if(android.os.Build.VERSION.SDK_INT>=30){android.graphics.Insets bars=insets.getInsets(android.view.WindowInsets.Type.systemBars()|android.view.WindowInsets.Type.displayCutout()|android.view.WindowInsets.Type.ime());v.setPadding(bars.left,bars.top,bars.right,bars.bottom);} return insets;});
        if(android.os.Build.VERSION.SDK_INT>=30)getWindow().setDecorFitsSystemWindows(false);
        LinearLayout bar=new LinearLayout(this);bar.setGravity(Gravity.CENTER_VERTICAL);bar.setPadding(dp(8),0,dp(12),0);root.addView(bar,-1,dp(58));
        back=label("◈",23,LIME,true);bar.addView(back,dp(46),-1);back.setContentDescription("Back");back.setOnClickListener(v->onBackPressed());
        heading=label("Fieldday India",20,Color.WHITE,true);heading.setGravity(Gravity.LEFT|Gravity.CENTER_VERTICAL);bar.addView(heading,new LinearLayout.LayoutParams(0,-1,1));
        TextView info=label("ⓘ",22,LIME,true);info.setContentDescription("About offline field guide");bar.addView(info,dp(48),-1);info.setOnClickListener(v->new AlertDialog.Builder(this).setTitle("Fieldday India").setMessage("Your field guides, heritage notes, seven 3D exhibits and two planning hubs are bundled on this device. Saved items stay here. Route times are estimates; check local access before leaving. Source links open in your browser.").setPositiveButton("Got it",null).show());
        web=new WebView(this);web.setBackgroundColor(PAPER);root.addView(web,new LinearLayout.LayoutParams(-1,0,1));
        WebSettings settings=web.getSettings();settings.setJavaScriptEnabled(true);settings.setDomStorageEnabled(true);settings.setAllowFileAccess(false);settings.setAllowContentAccess(false);settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        WebViewAssetLoader loader=new WebViewAssetLoader.Builder().addPathHandler("/assets/",new WebViewAssetLoader.AssetsPathHandler(this)).build();
        web.setWebChromeClient(new WebChromeClient());
        web.setWebViewClient(new WebViewClient(){
            @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest request){Uri u=request.getUrl();
                if(local(u)){String path=u.getPath();if(path.endsWith("/"))u=u.buildUpon().appendPath("index.html").build(); WebResourceResponse r=loader.shouldInterceptRequest(u);
                    if(r!=null && r.getData()!=null){if(u.getPath().endsWith(".js"))r.setMimeType("application/javascript");return r;}}
                return new WebResourceResponse("text/plain","UTF-8",404,"Not found",Collections.emptyMap(),new ByteArrayInputStream(new byte[0]));}
            @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request){Uri u=request.getUrl();if(local(u))return false;
                if(request.isForMainFrame() && HOST.equals(u.getHost()) && "/native/print".equals(u.getPath())){PrintManager p=(PrintManager)getSystemService(PRINT_SERVICE);p.print("Fieldday itinerary",web.createPrintDocumentAdapter("Fieldday itinerary"),null);}
                else if(request.isForMainFrame() && request.hasGesture() && "https".equals(u.getScheme()) && !HOST.equals(u.getHost())){try{startActivity(new Intent(Intent.ACTION_VIEW,u));}catch(ActivityNotFoundException e){Toast.makeText(MainActivity.this,"No browser installed",Toast.LENGTH_SHORT).show();}}return true;}
            @Override public void onPageFinished(WebView v,String url){updateChrome(url);}
            @Override public void doUpdateVisitedHistory(WebView v,String url,boolean reload){remember(url);updateChrome(url);}
        });
        navigation=new LinearLayout(this);navigation.setBackgroundColor(DARK);root.addView(navigation,-1,dp(66));
        for(int i=0;i<TABS.length;i++){int n=i;LinearLayout tab=new LinearLayout(this);tabs[i]=tab;tab.setOrientation(LinearLayout.VERTICAL);tab.setGravity(Gravity.CENTER);tab.setFocusable(true);tab.setContentDescription(TABS[i]);tab.setOnClickListener(v->openTab(n));navigation.addView(tab,new LinearLayout.LayoutParams(0,-1,1));
            tab.addView(label(ICONS[i],21,Color.WHITE,true));tab.addView(label(TABS[i],12,Color.WHITE,true));}
        if(state!=null && state.getStringArrayList("trail")!=null)trail.addAll(state.getStringArrayList("trail"));
        if(state==null || web.restoreState(state)==null)openTab(0);
    }
    boolean local(Uri uri){return "https".equals(uri.getScheme()) && HOST.equals(uri.getAuthority()) && uri.getPath()!=null && uri.getPath().startsWith("/assets/");}
    private void remember(String url){if(url!=null && local(Uri.parse(url)) && (trail.isEmpty()||!url.equals(trail.get(trail.size()-1)))){trail.add(url);if(trail.size()>100)trail.remove(0);}}
    void openTab(int i){String url=BASE+"#"+HASH[i];remember(url);web.loadUrl(url);}
    void updateChrome(String url){if(navigation==null||url==null)return;Uri u=Uri.parse(url);String path=u.getPath(),hash=u.getFragment();boolean detail=path!=null && !(path.equals("/assets/")||path.equals("/assets/index.html"));int idx=0;
        if(detail || "places".equals(hash) || (hash!=null && hash.startsWith("place-")))idx=1;
        else for(int i=0;i<HASH.length;i++)if(HASH[i].equals(hash))idx=i;
        selected=idx;heading.setText(detail?(path.contains("/layers/")?"Heritage layers":"Field guide"):idx==0?"Fieldday India":new String[]{"Discover","Explore India","Day planner","3D Geo Lab","Field notebook"}[idx]);
        back.setText(trail.size()>1?"‹":"◈");back.setEnabled(trail.size()>1);
        for(int i=0;i<tabs.length;i++){LinearLayout t=tabs[i];if(t==null)continue;boolean active=i==idx;t.setSelected(active);GradientDrawable pill=new GradientDrawable();pill.setColor(active?LIME:DARK);pill.setCornerRadius(dp(14));t.setBackground(pill);for(int j=0;j<t.getChildCount();j++)((TextView)t.getChildAt(j)).setTextColor(active?DARK:Color.WHITE);}
    }
    @Override public void onBackPressed(){if(trail.size()>1){trail.remove(trail.size()-1);web.loadUrl(trail.get(trail.size()-1));}else if(selected!=0)openTab(0);else super.onBackPressed();}
    @Override protected void onSaveInstanceState(Bundle state){super.onSaveInstanceState(state);web.saveState(state);state.putStringArrayList("trail",new ArrayList<>(trail));}
    @Override protected void onDestroy(){web.stopLoading();web.destroy();super.onDestroy();}
}
