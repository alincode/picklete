describe("about Order", () => {
  describe("pay Order", () => {
    let testdOrder, shopCode;
    before( async (done) => {
      var newOrder2 = {
        serialNumber: '99999',
        paymentIsConfirmed: true,
        paymentTotalAmount: 1000,
        paymentConfirmName:  '測試',
        paymentConfirmPostfix: '54321',
        quantity: 2,
        UserId: 2,
      };
      testdOrder = await db.Order.create(newOrder2);

      let shopcode = {
          title: '滿 500 折 100',
          code: '1234ABCD',
          startDate: '1970-01-01',
          endDate: '1970-01-01',
          type: 'price',
          description: 100,
          restriction: 500,
          sentType: 'all',
          sentContent: '滿 500 折 100 !!',
          restrictionDate: 'on'
        };
      shopCode = await db.ShopCode.create(shopcode);

      var orderItems2 =[{
        name: '好物三選1',
        description: '好東西，買買買',
        quantity: 1,
        price: 500,
        OrderId: testdOrder.id,
        ProductId: 1
      },{
        name: '好物三選2',
        description: '好東西，買買買',
        quantity: 2,
        price: 100,
        OrderId: testdOrder.id,
        ProductId: 1
      },{
        name: '好物三選3',
        description: '好東西，買買買',
        quantity: 3,
        price: 200,
        OrderId: testdOrder.id,
        ProductId: 1
      }];
      let createOrderItems = await db.OrderItem.bulkCreate(orderItems2);
      done();
    });


    it("create order use shopcode should be success", async (done) => {
      try {
        let newOrder ={
          orderItems: [
            { ProductId: '1', price: '475', quantity: '1' },
            { ProductId: '1', price: '590', quantity: '2' }
          ],
          paymentTotalAmount: '565',
          user: {
            username: 'AAAd',
            email: 'user1@picklete.localhost',
            mobile: '0912345678',
            city: '苗栗縣',
            district: '竹南鎮',
            zipcode: '350',
            address: '測試用地址不用太在意'
          },
          shipment: {
            username: 'AAAd',
            email: 'user1@picklete.localhost',
            mobile: '0912345678',
            city: '苗栗縣',
            district: '竹南鎮',
            zipcode: '350',
            address: '測試用地址不用太在意',
            shippingType: 'delivery',
            shippingRegion: '外島',
            shippingFee: '100'

          },
          invoice: {
            type: 'duplex',
            taxId: '1122334455',
            charityName: '',
            title: 'miiixr'
          },
          usedDiscountPoint: 'false',
          shippingFee: 100 ,
          paymentMethod: 'ATM',
          shopCode: shopCode.code
        };

        let result = await request(sails.hooks.http.app).post("/api/order").send({
          order: newOrder
        });

        let createdOrder = await db.Order.find({
          include:[
            db.Shipment,
            db.Invoice,
            {
              model: db.User,
              where: {
                email: 'user1@picklete.localhost'
              }
            },

          ]
        });

        createdOrder.Shipment.should.be.Object;
        createdOrder.Shipment.should.have.property('shippingType', 'delivery');
        createdOrder.Shipment.should.have.property('shippingFee', 100);
        createdOrder.User.should.be.Object;
        createdOrder.Invoice.should.be.Object;


        done();


      } catch (e) {
        done(e);

      }


    });

    it("create order should be success", async (done) => {
      try {
        let newOrder ={
          orderItems: [
            { ProductId: '1', price: '475', quantity: '1' },
            { ProductId: '1', price: '590', quantity: '2' }
          ],
          paymentTotalAmount: '565',
          user: {
            username: 'AAAd',
            email: 'user1@picklete.localhost',
            mobile: '0912345678',
            city: '苗栗縣',
            district: '竹南鎮',
            zipcode: '350',
            address: '測試用地址不用太在意'
          },
          shipment: {
            username: 'AAAd',
            email: 'user1@picklete.localhost',
            mobile: '0912345678',
            city: '苗栗縣',
            district: '竹南鎮',
            zipcode: '350',
            address: '測試用地址不用太在意',
            shippingType: 'delivery',
            shippingRegion: '外島',
            shippingFee: '100'

          },
          invoice: {
            type: 'duplex',
            taxId: '1122334455',
            charityName: '',
            title: 'miiixr'
          },
          usedDiscountPoint: 'false',
          shippingFee: 100 ,
          paymentMethod: 'ATM'};

        let result = await request(sails.hooks.http.app).post("/api/order").send({
          order: newOrder
        });

        let createdOrder = await db.Order.find({
          include:[
            db.Shipment,
            db.Invoice,
            {
              model: db.User,
              where: {
                email: 'user1@picklete.localhost'
              }
            },

          ]
        });

        createdOrder.Shipment.should.be.Object;
        createdOrder.Shipment.should.have.property('shippingType', 'delivery');
        createdOrder.Shipment.should.have.property('shippingFee', 100);
        createdOrder.User.should.be.Object;
        createdOrder.Invoice.should.be.Object;


        done();


      } catch (e) {
        done(e);

      }


    });


    it("find and pay", (done) => {
      request(sails.hooks.http.app)
      .get(`/api/order/pay?id=${testdOrder.id}`)
      .end((err, res) => {
        if (res.statusCode === 500) {
          return done(body)
        }
        res.statusCode.should.equal(200);
        return done();
      });
    });

    it("get an Bonus point. ", async (done) => {
      request(sails.hooks.http.app)
      .get("/order/bonus?email=user1@picklete.local")
      .end(async (err, res) => {
        if (res.statusCode === 500) {
          return done(body)
        }
        res.statusCode.should.equal(200);
        res.body.bonusPoint.used.should.be.number;
        res.body.bonusPoint.remain.should.be.number;
        res.body.bonusPoint.email.should.be.String;
        done(err);
      });
    });
  });
  describe.skip("about Order status.", () => {
    let testOrder = {};
    before( async (done) => {
      let newUser = {
        username: "testOrderUser",
        email: "smlsun@gmail.com",
        password: "testuser"
      };

      let createdUser = await db.User.create(newUser);

      let newOrder = {
        quantity: 10,
        serialNumber: '11223344',
        UserId: createdUser.id
      };

      testOrder = await db.Order.create(newOrder);
      done();
    });

    let syncLink = '';

    it("request order sync.", (done) => {
      request(sails.hooks.http.app)
      .get("/api/order/sync?email=smlsun@gmail.com&host=/api/order/status")
      .end((err, res) => {
        let result = res.body;

        result.syncLink.should.be.String;
        result.syncLinkHost.should.be.equal('/api/order/status');
        result.syncLinkParams.should.be.String;
        result.success.should.be.true;
        syncLink = result.syncLink;
        console.log('syncLink', syncLink);

        done();

      });
    });

    it("get Order status should be success.", (done) => {
      console.log('=== syncLink ===\n', syncLink);
      // ex: /api/order/status?token=...&email=smlsun@gmail.com
      request(sails.hooks.http.app)
      .get(syncLink)
      .end((err, res) => {
        let {purchaseHistory} = res.body;

        console.log('purchaseHistory', purchaseHistory);

        purchaseHistory.should.be.Array;
        purchaseHistory[0].should.be.Object;
        purchaseHistory[0].OrderItems.should.be.Object;
        // purchaseHistory[0].Shipemnt.should.be.Object;
        purchaseHistory[0].User.should.be.Object;


        return done(err);
      });
    });

    it("update order status to paymentConfirm. ", async (done) => {
      request(sails.hooks.http.app)
      .get(`/order/statusUpdate/${testOrder.id}?status=paymentConfirm`)
      .end(async (err, res) => {
        let order = await db.Order.findById(testOrder.id);
        order.status.should.be.equal('paymentConfirm');

        done(err);
      });
    });

    it("update order status to deliveryConfirm. ", async (done) => {
      request(sails.hooks.http.app)
      .get(`/order/statusUpdate/${testOrder.id}?status=deliveryConfirm`)
      .end(async (err, res) => {
        if (res.statusCode === 500) {
          return done(body)
        }
        res.statusCode.should.equal(200);
        res.body.products.should.be.Array;

        done(err);
      });
    });

    it("get an order. ", async (done) => {
      request(sails.hooks.http.app)
      .get(`/order/find/${testOrder.id}`)
      .end(async (err, res) => {
        if (res.statusCode === 500) {
          return done(body)
        }
        res.statusCode.should.equal(200);
        res.body.order.status.should.be.String;
        done(err);
      });
    });

  });
});
