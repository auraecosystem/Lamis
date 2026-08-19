world
    fps = 30
    view = 6
    turf = /turf/floor

mob
    var/hp = 100
    var/max_hp = 100

    verb/check_status()
        set category = "Commands"
        src << "Your current HP is [hp]/[max_hp]."
