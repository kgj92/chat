function createRoom() {

    const roomName =
        document.getElementById("roomName").value.trim();

    const roomDesc =
        document.getElementById("roomDesc").value.trim();

    if(roomName === ""){
        alert("방 이름을 입력하세요.");
        return;
    }

    const rooms =
        JSON.parse(localStorage.getItem("rooms")) || [];

    const newRoom = {
        id: Date.now(),
        name: roomName,
        description: roomDesc,
        members: 1,
        createdAt: new Date()
    };

    rooms.push(newRoom);

    localStorage.setItem(
        "rooms",
        JSON.stringify(rooms)
    );

    alert("채팅방 생성 완료!");

    location.href = "index.html";
}