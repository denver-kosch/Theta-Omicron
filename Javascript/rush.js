function getCommittee() {
    let personnel = {};

    $.get('../Functions/getRushInfo.php', {}, function(data) {
        if (data.status == 'success') {
            personnel = data.personnel;
            personnel.forEach(person => $('#committee').append(rushCard(person)));
        }
        else alert("Failed to retrieve committee: ", data.error);
    }, 'json');
    
    let rushCard = (person) => {
        let role = person.roles.includes('gm') ? 'Grand Master' : 
        person.roles.includes('gmc') ? 'Grand Master of Ceremonies' :
        person.roles.includes('CQChair') ? "Rush Chairman":
        "Rush Committee";
        
        return `
        <div class='rushCard'>
            <img src="../Images/profilePics/${person.profilePic}" alt="${person.firstName + ' ' + person.lastName}"/>
            <h4><b>${person.firstName + ' ' + person.lastName}</b></h4>
            <h4>${role}</h4>

            <a href='mailto:${person.email}'><img src='../Images/profilePics/mail.png' alt='Email'></a>
        </div>`;
    };

}


$(document).ready(function() {
    //Set filler's height dynamiccaly
    $('.filler').css('height', $('.nav').outerHeight() + "px");
    
    //Get committee cards
    getCommittee();

    $("#navLogo").mouseenter(function() {
        $(this).find("img").attr('src', '../Images/crestC.png');

    });
    $("#navLogo").mouseleave(function() {
        $(this).find("img").attr('src', '../Images/crestBW.png');
    });

    $('.interest').click(function() {
        $('#iLink')[0].click();
    })
});