package mts.mtech.enums;

public enum RoomType {
    STANDARD("standard"),
    LUXURY("luxury"),
    STANDARD_TWIN("standard twin");

    private final String room;

    RoomType(String room) {
        this.room = room;
    }

    public String getRoom() {
        return room;
    }
}
