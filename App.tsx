import React, { useState, useEffect } from 'react';
import { AppScreen } from './types';
import { UrlInputScreen } from './components/URLCheck/InputScreen';
import { UrlAnalyzingScreen } from './components/URLCheck/AnalyzingScreen';
import { UrlResultScreen } from './components/URLCheck/ResultScreen';
import { AboutScreen } from './components/AboutScreen';
import { StartupScreen } from './components/StartupScreen';
import { URLAnalysisResult } from './types';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.STARTUP);
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [urlAnalysisResult, setUrlAnalysisResult] = useState<URLAnalysisResult | null>(null);
  const [isStartupExiting, setIsStartupExiting] = useState(false);

  useEffect(() => {
    // Initialize history state immediately for the root
    if (window.history.state === null) {
      window.history.replaceState({ screen: AppScreen.STARTUP }, '', '#startup');
    }

    if (currentScreen === AppScreen.STARTUP) {
      const loadTimer = setTimeout(() => {
        // Start the exit transition
        setIsStartupExiting(true);

        // Finalize unmount after transition duration (400ms)
        const unmountTimer = setTimeout(() => {
          setCurrentScreen(AppScreen.URL_INPUT);
          setIsStartupExiting(false);
          // Update history state to URL_INPUT
          window.history.replaceState({ screen: AppScreen.URL_INPUT }, '', '#url-input');
        }, 400);

        return () => clearTimeout(unmountTimer);
      }, 2500); // 2.5 seconds loading time
      return () => clearTimeout(loadTimer);
    }
  }, [currentScreen]);

  // Handle native back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      const screen = state?.screen || AppScreen.URL_INPUT;

      // Reset sub-states when navigating
      if (screen === AppScreen.URL_INPUT) {
        setCurrentUrl('');
        setUrlAnalysisResult(null);
      }

      setCurrentScreen(screen);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (screen: AppScreen, hash: string, replace = false) => {
    if (replace) {
      window.history.replaceState({ screen }, '', `#${hash}`);
    } else {
      window.history.pushState({ screen }, '', `#${hash}`);
    }
    setCurrentScreen(screen);
  };

  // URL Analysis handlers
  const handleUrlSubmitted = (url: string) => {
    setCurrentUrl(url);
    navigateTo(AppScreen.URL_ANALYZING, 'url-analyzing');
  };

  const handleUrlAnalysisComplete = (result: URLAnalysisResult) => {
    setUrlAnalysisResult(result);
    navigateTo(AppScreen.URL_RESULT, 'url-result', true);
  };

  const handleAnalyzeAnotherUrl = () => {
    setCurrentUrl('');
    setUrlAnalysisResult(null);
    navigateTo(AppScreen.URL_INPUT, 'url-input', true);
  };

  const handleBackFromUrlResult = () => {
    // Go back to input screen, keeping the URL for editing
    setUrlAnalysisResult(null);
    navigateTo(AppScreen.URL_INPUT, 'url-input', true);
  };

  const handleBackToHome = () => {
    // In the new flow, "Home" is URL Input.
    if (currentScreen !== AppScreen.URL_INPUT) {
      navigateTo(AppScreen.URL_INPUT, 'url-input');
    }
  };

  const handleGoToAbout = () => {
    navigateTo(AppScreen.ABOUT, 'about');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.STARTUP:
        return <StartupScreen onAboutClick={handleGoToAbout} />;

      case AppScreen.URL_INPUT:
        return (
          <UrlInputScreen
            onUrlSubmitted={handleUrlSubmitted}
            initialUrl={currentUrl}
          />
        );

      case AppScreen.URL_ANALYZING:
        if (!currentUrl) return null;
        return (
          <UrlAnalyzingScreen
            url={currentUrl}
            onCancel={handleBackToHome}
            onComplete={handleUrlAnalysisComplete}
          />
        );

      case AppScreen.URL_RESULT:
        if (!currentUrl || !urlAnalysisResult) return null;
        return (
          <UrlResultScreen
            url={currentUrl}
            result={urlAnalysisResult}
            onBack={handleBackFromUrlResult}
            onAnalyzeAnother={handleAnalyzeAnotherUrl}
          />
        );

      case AppScreen.ABOUT:
        return <AboutScreen onBack={handleBackToHome} />;

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white overflow-hidden relative">
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {/* Startup Screen - Only render when starting up or exiting */}
        {(currentScreen === AppScreen.STARTUP || isStartupExiting) && (
          <StartupScreen
            onAboutClick={handleGoToAbout}
            isExiting={isStartupExiting}
          />
        )}
      </div>

      {/* Main App Screens */}
      {currentScreen !== AppScreen.STARTUP && (
        <div className="absolute inset-0 z-[30] bg-white">
          {renderScreen()}
        </div>
      )}
    </div>
  );
};

export default App;