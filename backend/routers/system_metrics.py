from fastapi import APIRouter
import psutil
import time

router = APIRouter()

# Keep track of previous disk I/O to calculate speed
_last_disk_io = psutil.disk_io_counters()
_last_disk_time = time.time()

@router.get("/")
async def get_system_metrics():
    global _last_disk_io, _last_disk_time
    
    # CPU
    cpu_percent = psutil.cpu_percent(interval=None)
    
    # RAM
    mem = psutil.virtual_memory()
    ram_total_gb = mem.total / (1024**3)
    ram_used_gb = mem.used / (1024**3)
    ram_percent = mem.percent
    
    # Disk Usage
    disk_usage = psutil.disk_usage('.')
    disk_total_gb = disk_usage.total / (1024**3)
    disk_free_gb = disk_usage.free / (1024**3)
    
    # Disk IO Speed
    current_time = time.time()
    current_disk_io = psutil.disk_io_counters()
    
    read_speed_mb = 0.0
    if _last_disk_io and current_disk_io and (current_time - _last_disk_time) > 0:
        bytes_read = current_disk_io.read_bytes - _last_disk_io.read_bytes
        read_speed_mb = (bytes_read / (1024**2)) / (current_time - _last_disk_time)
        
    _last_disk_io = current_disk_io
    _last_disk_time = current_time
    
    return {
        "cpu": {
            "percent": cpu_percent
        },
        "ram": {
            "total_gb": round(ram_total_gb, 2),
            "used_gb": round(ram_used_gb, 2),
            "percent": ram_percent
        },
        "disk": {
            "total_gb": round(disk_total_gb, 2),
            "free_gb": round(disk_free_gb, 2),
            "read_speed_mb_s": round(read_speed_mb, 2)
        }
    }
