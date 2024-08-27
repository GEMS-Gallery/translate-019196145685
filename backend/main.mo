import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Error "mo:base/Error";
import Debug "mo:base/Debug";

actor {
  public func convertTextToSpeech(text : Text, language : Text) : async ?Text {
    Debug.print("Converting text to speech: " # text # " in " # language);
    
    if (Text.size(text) == 0) {
      Debug.print("Error: Empty text provided");
      return null;
    };
    
    if (not (language == "english" or language == "spanish" or language == "german")) {
      Debug.print("Error: Unsupported language");
      return null;
    };
    
    // This is still a mock function, but now it always returns a string
    let dummyAudioData = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//MUZAAAAAGkAAAAAAAAA0gAAAAATEFN//MUZAMAAAGkAAAAAAAAA0gAAAAARTMu//MUZAYAAAGkAAAAAAAAA0gAAAAAOTku//MUZAkAAAGkAAAAAAAAA0gAAAAANVVV";
    
    Debug.print("Returning audio data: " # dummyAudioData);
    ?dummyAudioData
  };
}
