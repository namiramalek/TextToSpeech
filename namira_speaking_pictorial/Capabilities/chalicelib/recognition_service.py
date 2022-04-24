import boto3


class RecognitionService:
    def __init__(self, storage_service):
        self.client = boto3.client('rekognition')
        self.bucket_name = storage_service.get_storage_location()

    def detect_text(self, file_name):
        response = self.client.detect_text(
            Image = {
                'S3Object': {
                    'Bucket': self.bucket_name,
                    'Name': file_name
                }
            }
        )

        objects = []
        for label in response["Labels"]:
            objects.append({
                'label': label['Name'],
                'confidence': label['Confidence']
            })
        return objects

    def text_detect(self, file_name):
        response = self.client.detect_text(
            Image = {
                'S3Object': {
                    'Bucket': self.bucket_name,
                    'Name': file_name
                }
            }
        )

        detected_lines = []
        for i in response['TextDetections']:
            if i['Type'] == 'LINE':
                detected_lines.append({
                    'text': i['DetectedText'],
                    'confidence': i['Confidence'],
                    'boundingBox': i['Geometry']['BoundingBox']
                })

        return detected_lines

