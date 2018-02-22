function JsonResponse(data,errorMessage){
    this.errorMessge = errorMessage;
    this.data = data;
}
module.exports.JsonResponse = JsonResponse;