class NetworkAgent {
  constructor() {
    this.method = 'POST';
    this.url = "https://7leyf90jbd.execute-api.ap-northeast-1.amazonaws.com/prod/yongkangMongoAccess";    
    this.headers = {
      'Content-Type': 'application/json'
    };
  }

  async sendPost(dataObject) {
    const response = await fetch(this.url, {
      method: this.method,
      headers: this.headers,
      body: JSON.stringify(dataObject)
    });
    // parses JSON response into native JavaScript objects
    return response.json();
  }
}