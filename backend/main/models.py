from django.db import models
from django.urls import reverse
from django.core.validators import RegexValidator, MinValueValidator


class HtmlTag(models.Model):
  targeturl = models.URLField(
    verbose_name='使いたい広告用素材URL',
    max_length=40,
    validators=[
      RegexValidator(
        r'^978-4-[0-9]{4}-[0-9]{4}-[0-9X]{1}$',
        message='ISBNコードは正しい形式で指定してください。')
    ]
  )
  articletitle = models.CharField(
    verbose_name='ブログのタイトル',
    max_length=60,
    validators=[

    ]
  )
  affiriateurl = models.URLField(
    verbose_name='アフィリエイト広告用url',
    max_length=60,
    validators=[
      MinValueValidator(
        17,
        message='価格は正の整数で指定してください。'
      )
    ]
  )
  materialtype = models.CharField(
    verbose_name='広告素材のタイプ',
    max_length=50,
    choices = [
      ('画像', '画像'),
      ('サムネイル用画像', 'サムネイル用画像'),
      ('ポップアップ用画像', 'ポップアップ用画像'),
      ('広告元へのリンク', '広告元へのリンク'),
    ],
  )

  blogtemplate = models.TextField(
    verbose_name='template',
    max_length=5000,
    
  )

  published = models.DateField(
      verbose_name='刊行日'
  )
  def __str__(self):
    return f'{self.title}({self.publisher}/{self.price}円)'

  # class Meta:
  #     ordering = ('published',)

  def get_absolute_url(self):
    return f'details/{self.id}'

#=> Django3速習 sampleコード ref[https://wings.msn.to/index.php/-/A-03/WGS-PYF-001/]
class Book(models.Model):
  isbn = models.CharField(
    verbose_name='ISBNコード',
    max_length=20,
    validators=[
      RegexValidator(
        r'^978-4-[0-9]{4}-[0-9]{4}-[0-9X]{1}$',
        message='ISBNコードは正しい形式で指定してください。')
    ]
  )
  title = models.CharField(
    verbose_name='書名',
    max_length=100
  )
  price = models.IntegerField(
    verbose_name='価格',
    default = 0,
    validators=[
      MinValueValidator(
        17,
        message='価格は正の整数で指定してください。'
      )
    ]
  )
  publisher = models.CharField(
    verbose_name='出版社',
    max_length=50,
    choices = [
      ('翔泳社', '翔泳社'),
      ('技術評論社', '技術評論社'),
      ('秀和システム', '秀和システム'),
      ('SBクリエイティブ', 'SBクリエイティブ'),
      ('日経BP', '日経BP'),
    ],
  )
  published = models.DateField(
      verbose_name='刊行日'
  )
  def __str__(self):
    return f'{self.title}({self.publisher}/{self.price}円)'

  # class Meta:
  #     ordering = ('published',)

  def get_absolute_url(self):
    return f'details/{self.id}'

class Review(models.Model):
  book = models.ForeignKey(Book, on_delete=models.CASCADE)
  name = models.CharField(
    verbose_name='名前',
    max_length=20
  )
  body = models.TextField(
    verbose_name='本文',
    max_length=255
  )
  def __str__(self):
    return f'{self.name}: {self.body[:10]}'

class Author(models.Model):
  books = models.ManyToManyField(Book)
  name = models.CharField(
    verbose_name='名前',
    max_length=20
  )
  address = models.CharField(
    verbose_name='住所',
    max_length=100
  )
  def __str__(self):
    return self.name

class User(models.Model):
  author = models.OneToOneField(Author, on_delete=models.CASCADE)    
  handle = models.CharField(
    verbose_name='ユーザー名',
    max_length=20
  )
  email = models.CharField(
    verbose_name='メールアドレス',
    max_length=100
  )
  def __str__(self):
    return self.handle

#=> ここまで