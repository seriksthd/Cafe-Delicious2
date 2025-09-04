import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Star, Clock, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

const Home = () => {
  const features = [
    {
      icon: <Coffee className="h-8 w-8 text-amber-600" />,
      title: "Жогорку сапаттуу кофе",
      description: "Дүйнөнүн эң мыкты кофе сортторунан даярдалган"
    },
    {
      icon: <Clock className="h-8 w-8 text-amber-600" />,
      title: "Тез кызмат көрсөтүү",
      description: "Заказыңыз 15 мүнөттөн кыска убакытта даяр болот"
    },
    {
      icon: <Star className="h-8 w-8 text-amber-600" />,
      title: "Сапаттуу тамак-аш",
      description: "Жаңы жана жогорку сапаттуу продукттардан гана"
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 min-h-screen flex items-center">
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <h1 className="text-5xl lg:text-7xl font-serif font-bold text-gray-900 mb-6">
                <span className="gradient-text">Cafe</span>
                <br />
                <span className="text-gray-800">Delicious</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Бишкектеги эң мыкты кафе! Жаңы даярдалган кофе, 
                жылуу атмосфера жана сонун тамак-аш менен.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/menu">
                  <Button className="btn-cafe text-lg px-8 py-4">
                    Меню көрүү
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="btn-cafe-outline text-lg px-8 py-4"
                  onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                >
                  Көбүрөөк билүү
                </Button>
              </div>
            </div>
            
            <div className="relative slide-up">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl transform rotate-6 opacity-20"></div>
                <img
                  src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Кафе интерьери"
                  className="relative w-full h-96 object-cover rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              Эмне үчүн <span className="gradient-text">биз</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Биз ар бир кардарыбызга эң мыкты кызмат көрсөтүүгө умтулабыз
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover border-none shadow-lg bg-gradient-to-br from-white to-amber-50">
                <CardContent className="p-8 text-center">
                  <div className="mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Кофе даярдоо"
                className="w-full h-96 object-cover rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">
                Биздин <span className="gradient-text">тарых</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                2020-жылы ачылган биздин кафе Бишкектеги эң популярдуу жерлердин бири болуп калды. 
                Биз ар дайым жогорку сапатты жана мыкты кызмат көрсөтүүнү максат кылабыз.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Биздин командасы күнүгө 1000дөн ашык кардарларга кызмат көрсөтүп, 
                алардын күнүн жакшы кылууга аракет кылат.
              </p>
              <Link to="/menu">
                <Button className="btn-cafe">
                  Меню көрүү
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              <span className="gradient-text">Байланыш</span> маалыматы
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-hover border-none shadow-lg">
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-amber-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Дарегибиз</h3>
                <p className="text-gray-600">
                  Ч. Айтматов көчөсү 123,<br />
                  Бишкек, Кыргызстан
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover border-none shadow-lg">
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 text-amber-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Телефон</h3>
                <p className="text-gray-600">
                  +996 555 123 456<br />
                  +996 777 987 654
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover border-none shadow-lg">
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 text-amber-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">
                  info@cafedelicious.kg<br />
                  order@cafedelicious.kg
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;