"""Getting Started Example for Python 2.7+/3.3+"""
from boto3 import Session
from botocore.exceptions import BotoCoreError, ClientError
from contextlib import closing
import os
import sys
import subprocess
from tempfile import gettempdir
import boto3
import time

class SpeechRecognition:
    def __init__(self):
        self.client = boto3.client('polly')
       

    def text_to_speech(self, text):
        try:
            response = self.client.synthesize_speech(Text=text, OutputFormat="mp3",
                                        VoiceId="Joanna")
        except (BotoCoreError, ClientError) as error:
            
            print(error)
            sys.exit(-1)

        if "AudioStream" in response:
        
            with closing(response["AudioStream"]) as stream:
            
                output = os.path.join(os.getcwd(), "namira_speaking_pictorial.mp3")
                

                try:
                    # Writing the output as a binary stream after opening the file
                    with open(output, "wb") as file:
                        file.write(stream.read())
                    
                except IOError as error:
                   
                    print(error)
                    sys.exit(-1)

        else:
            print("Audio Streaming Error!")
            sys.exit(-1)

        

                          
