import moment from 'moment';
describe("about product service", () => {
  let createdProduct, createdProduct2, createdProductGm;
  let productGmA, productGmB, dptA, dptB, dptSubA, dptSubB ,dptC, dptSubC;
  before(async (done) => {

    try {

      dptA = await db.Dpt.create({
        name: 'test 大館 A',
        weight: 999,
        official: true,
      });

      dptB = await db.Dpt.create({
        name: 'test 大館 B',
        weight: 999,
        official: true,
      });

      dptC = await db.Dpt.create({
        name: 'test 大館 C',
        weight: 999,
        official: true,
      });

      dptSubA = await db.DptSub.create({
        name: 'test 小館 A',
        weight: 100,
        official: false
      })

      dptSubB = await db.DptSub.create({
        name: 'test 小館 B',
        weight: 100,
        official: false
      })

      dptSubC = await db.DptSub.create({
        name: 'test 小館 C',
        weight: 100,
        official: false
      })

      await dptA.setDptSubs(dptSubA);
      await dptB.setDptSubs(dptSubB);
      await dptC.setDptSubs(dptSubC);

      createdProductGm = await db.ProductGm.create({
        brandId: 1,
        explain: 'req.body.explain',
        usage: 'req.body.usage',
        notice: 'req.body.notice',
        depId: dptA.id,
        depSubId: dptSubA.id
      });

      await createdProductGm.setDpts([dptA]);
      await createdProductGm.setDptSubs([dptSubA]);


      createdProduct = await db.Product.create({
        color: '1',
        description: '11',
        productNumber: '11',
        stockQuantity: '999',
        isPublish: 'false',
        ProductGmId: createdProductGm.id
      });

      createdProduct2 = await db.Product.create({
        color: '2',
        description: '22',
        productNumber: '22',
        stockQuantity: '999',
        isPublish: 'false',
        ProductGmId: createdProductGm.id
      });

      // build test data for productQuery spec

      let createdQueryProductGmA = await db.ProductGm.create({
        brandId: 2,
        name: "ProductGroupA",
        depId: dptC.id,
        depSubId: dptSubC.id
      });

      let createdQueryProductGmB = await db.ProductGm.create({
        brandId: 3,
        name: "ProductGroupB",
        depId: dptC.id,
        depSubId: dptSubC.id
      });
      console.log('--------------');
      // console.log(JSON.stringify(createdQueryProductGms, null, 4));
      await createdQueryProductGmA.setDpts([dptC]);
      await createdQueryProductGmA.setDptSubs([dptSubC]);
      await createdQueryProductGmB.setDpts([dptC]);
      await createdQueryProductGmB.setDptSubs([dptSubC]);
      console.log('==================================3234');

      let createdQueryProducts = await db.Product.bulkCreate([{
        name: '',
        stockQuantity: '100',
        isPublish: 'true',
        price: 777,
        productNumber: '1-USA-2-G',
        photos: ['https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/shop-type-1.jpg'],
      },{
        name: '11234',
        stockQuantity: '100',
        isPublish: 'true',
        price: 555,
        productNumber: '1-USA-2-G',
        photos: ['https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/shop-type-1.jpg']
      },{
        name: '11235',
        stockQuantity: '100',
        isPublish: 'true',
        price: 555,
        productNumber: '1-USA-2-G',
        photos: ['https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/shop-type-1.jpg']
      },{
        name: '21235',
        stockQuantity: '100',
        isPublish: 'true',
        price: 555,
        productNumber: '2-USA-2-G',
        photos: ['https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/shop-type-1.jpg']
      },{
        name: '21235',
        stockQuantity: '100',
        isPublish: 'true',
        price: 555,
        productNumber: '2-USA-2-G',
        photos: ['https://dl.dropboxusercontent.com/u/9662264/iplusdeal/images/demo/shop-type-1.jpg']
      }]);
      console.log('==================================32345');

      let queryProductGroupA = await createdQueryProductGmA.setProducts([createdQueryProducts[0],createdQueryProducts[1],createdQueryProducts[2]]);
      let queryProductGroupB = await createdQueryProductGmB.setProducts([createdQueryProducts[3],createdQueryProducts[4]]);
      console.log('==================================323456');


      done();

    } catch (e) {
      console.log(e.stack);
      done(e);

    }
  });

  it("product create", async (done) => {
    let newProduct = {
      brandType: 'origin',
      brandId: '1',
      customBrand: '',
      dptId: [ '2', '1' ],
      dptSubId: [ '4', '2' ],
      name: '423423',
      price: '432',
      country: '432',
      madeby: '432',
      spec: '432',
      size: '432',
      service: [ 'express', 'store', 'package' ],
      comment: '432432',
      good:
       [ { 'photos-1': '',
           'photos-2': '',
           color: '3',
           description: '432',
           productNumber: '423432',
           stockQuantity: '999',
           isPublish: 'false' },
         { 'photos-1': '',
           'photos-2': '',
           color: '5',
           description: '432423',
           productNumber: '432432',
           stockQuantity: '999',
           isPublish: 'false' },
         { 'photos-1': '',
           'photos-2': '',
           color: '12',
           description: '432',
           productNumber: '432432',
           stockQuantity: '999',
           isPublish: 'false' } ],
      coverPhoto: [ '' ],
      explain: '<p>432432432432432</p>\r\n',
      notice: '<p>423423423432423</p>\r\n',
      tag: ',學生,寵物,旅行'
    };

    try {
      let product = await ProductService.create(newProduct);
      // console.log(product);
      done();
    } catch (e) {
      return done(e);
    }

  });

  it('product update', async (done) => {

    try {
      let updateProduct = {
        brandType: 'origin',
        brandId: '2',
        customBrand: 'OTHER',
        dptId: [ dptB.id ],
        dptSubId: [ dptSubB.id ],
        name: '111',
        price: '11',
        country: '11',
        madeby: '11',
        spec: '11',
        size: '11',
        service: [ 'express', 'store', 'package' ],
        comment: '11',
        good:
         [ { color: '1',
             name: '1111111',
             description: '1111111',
             productNumber: '1111111',
             stockQuantity: '999',
             isPublish: 'false',
             weight: 0,
             id:createdProduct.id },
            { color: '2',
             name: '1111111',
             description: '22222',
             productNumber: '2222',
             stockQuantity: '999',
             isPublish: 'true',
             weight: 1,
             id:createdProduct2.id } ],
        productGm: {
          id: createdProductGm.id
        },
        explain: '',
        notice: '',
        tag: '咖啡,午茶'
      };

      await ProductService.update(updateProduct);

      let updatedProduct = await db.Product.find({
        where: {
          id: createdProduct.id
        },
        include: [{
          model: db.ProductGm,
          include: [
            db.Dpt,
            db.DptSub
          ]
        }]
      });

      updatedProduct.ProductGm.Dpts[0].id.should.be.equal(dptB.id);
      updatedProduct.ProductGm.DptSubs[0].id.should.be.equal(dptSubB.id)

      done();
    } catch (e) {
      done(e);
    }

  });


  it('product call gm', async (done) => {
    try {
      let productGm = await ProductService.findGmWithImages(createdProductGm.id);
      console.log(productGm.Products);
      productGm.Products.length.should.above(1);
      done();
    } catch (e) {
      done(e);
    }

  });

  it('find Favorite list', async (done) => {
    try {
      let product = await ProductService.findFavorite({
        11: true,
        5: true,
        6: true
      });
      console.log(product);
      product.should.be.an.Object;
      done();
    } catch (e) {
      done(e);
    }
  });

  it('find NOT Favorite list', async (done) => {
    try {
      let product = await ProductService.findFavorite({});
      console.log(product);
      product.should.be.an.Array;
      done();
    } catch (e) {
      done(e);
    }
  });

  it('product query', async (done) => {

    let queryLimit = 100;
    let testingTimes = 5;
    try{

      let queryObj = {};
      // get sourceData through db
      let srcData = await db.Product.findAndCountAll({ limit: queryLimit });
      let srcCount = srcData.count,
          srcProducts = srcData.rows;

      // test all srcData
      for (let i=1; i<=testingTimes; i++) {
        let randomRowIndex = Math.floor((Math.random() * srcCount));
        let srcProduct = srcProducts[randomRowIndex];
        // check product name exist
        if(srcProduct.name) {
          let srcName = srcProduct.name;
          let len = srcName.length;
          let randomIndex = Math.floor((Math.random() * len));
          queryObj.name = srcName[randomIndex];
          let queryResult = await ProductService.productQuery(queryObj);
          let found = true;
          // search queryResult product.name include target name
          for (let product of queryResult) {
            // if not found
            if( product['name'].search(queryObj.name) < 0 ) {
              found = false;
              console.log('======================');
              console.log('can not find correct result by search name as "' + queryObj.name + '"');
              console.log(product);
              break;
            }
          }
          found.should.be.equal(true);
        }
      }

      done();
    } catch (e) {
      done(e);
    }
  });
});
