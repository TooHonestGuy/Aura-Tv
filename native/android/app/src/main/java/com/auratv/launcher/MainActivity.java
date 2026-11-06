package com.auratv.launcher;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(AuraAppsPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
