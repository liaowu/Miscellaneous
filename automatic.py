import os, sys, subprocess, shutil

upath = '/home/liaowu/'
rpath = '/var/www/'

if os.geteuid() == 0:
    print("We're root!")
else:
    print("We're not root.")
    subprocess.call(['sudo', 'python3', *sys.argv])
    sys.exit()

def copy(before, destination, tof):
    q = input('copying {0} to {1}, do you want to continue[y,n]: '.format(before, destination))
    if q == 'n':
        return()
    try: 
        if tof == "folder":
            shutil.copytree(before, destination)
        else:
            shutil.copy(before, destination)
        print('Copy {0} into {1} finished \n'.format(destination.split('/')[-1],destination.split('/')[-2]))

    except Exception as e:
        if 'File exists' in str(e):
            print('File/Folder {0} already exists under {1}'.format(destination.split('/')[-1],destination.split('/')[-2]))
            r = input('Do you want to replace it[y, n]: ')
            if r == 'y':
                if tof == "folder":
                    shutil.rmtree(destination)
                else:
                    os.remove(destination)
                print("trying again...")
                copy(before, destination, tof)
            else:
                return
        else:
            print(str(e))

print("WARNING! The virtual environment will not be automatically made")
print('\n CHANGING FRONTEND')
copy(upath + 'gitignorefiles/front/env/', upath + 'q/APP/env', 'folder')
copy(upath + 'gitignorefiles/front/dev.env', upath + 'q/APP/dev.env', 'file')
copy(upath + 'gitignorefiles/front/app.routes.js', upath + 'q/APP/app/app.routes.js', 'file')
copy(upath + 'gitignorefiles/front/resource', upath + 'q/APP/resource', 'folder')
print('\n if you have already swiched html to htmlback then enter no')
copy(rpath + 'html', rpath + 'htmlback', 'folder')
copy(upath + 'q/APP', rpath + 'html', 'folder')
os.system('restorecon -r /var/www/html')
os.system('chmod 755 -R /var/www/html')

print('\n CHANGING BACKEND \n')
copy(upath + 'gitignorefiles/back/local.py', upath + 'back/sofvie_api/config/local.py', 'file')
copy(upath + 'gitignorefiles/back/base.py', upath + 'back/sofvie_api/config/base.py', 'file')
copy(upath + 'gitignorefiles/back/.env', upath + 'back/sofvie_api/.env', 'file')
copy(upath + 'gitignorefiles/back/dev.py', upath + 'back/sofvie_api/config/dev.py', 'file')

n = input('giving permissions to all users, do you want to continue[y, n]')
if n == 'n':
    exit()

copy(upath + 'gitignorefiles/back/get_user_permissions_list.py', upath + 'back/apps/sofvie_user_authorization/api/views/get_user_permissions_list.py', 'file')
copy(upath + 'gitignorefiles/back/permissions.py', upath + 'back/apps/sofvie_user_authorization/api/permissions.py', 'file')
