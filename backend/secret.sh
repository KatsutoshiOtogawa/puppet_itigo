# django実行前に必ず行う。セキュリティのために必要。
python3 <<END
from django.core.management.utils import get_random_secret_key
import os

secret_key = get_random_secret_key()

with open(os.path.join(os.environ['HOME'],'.profile'), 'a') as f:
    f.write("export DJANGO_SECRET_KEY=\'{0}\'\n".format(secret_key))
END
