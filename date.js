

exports.getDate = function(){

    var today = new Date();

    let options = {
        weekday:'long',
        day:'numeric',
        month:'long'
    }
    
    return today.toLocaleDateString('en-US',options)
}

exports.getDay = function(){

    var today = new Date();

    let options = {
        weekday:'long'
    }
    
    return today.toLocaleDateString('en-US',options)
}
// console.log(module.exports);
