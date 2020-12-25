package com.musicbands;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.bugsnag.BugsnagReactNative;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import com.reactlibrary.RNThumbnailPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import ui.shine.RNShineButtonPackage;
import guichaguri.trackplayer.TrackPlayer;
import com.wix.autogrowtextinput.AutoGrowTextInputPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            BugsnagReactNative.getPackage(),
            new FIRMessagingPackage(),
            new ReactNativeDocumentPicker(),
            new RNThumbnailPackage(),
            new RNFetchBlobPackage(),
            new PickerPackage(),
            new RNShineButtonPackage(),
            new TrackPlayer(),
            new AutoGrowTextInputPackage(),
            new ReactVideoPackage(),
            new ReactNativeConfigPackage(),
            new RNI18nPackage(),
            new VectorIconsPackage(),
            new RNDeviceInfo()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    BugsnagReactNative.start(this);
    SoLoader.init(this, /* native exopackage */ false);
  }
}
